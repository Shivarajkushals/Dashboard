from django.core.management.base import BaseCommand
from django_redis import get_redis_connection

class Command(BaseCommand):
    help = 'Show Redis cache statistics'

    def handle(self, *args, **options):
        con = get_redis_connection("default")
        info = con.info()
        
        self.stdout.write(self.style.SUCCESS('=== Redis Cache Statistics ==='))
        self.stdout.write(f"Connected clients: {info.get('connected_clients', 0)}")
        self.stdout.write(f"Used memory: {info.get('used_memory_human', 'N/A')}")
        self.stdout.write(f"Total keys: {con.dbsize()}")
        self.stdout.write(f"Hits: {info.get('keyspace_hits', 0)}")
        self.stdout.write(f"Misses: {info.get('keyspace_misses', 0)}")
        
        hits = info.get('keyspace_hits', 0)
        misses = info.get('keyspace_misses', 0)
        total = hits + misses
        
        if total > 0:
            hit_rate = (hits / total) * 100
            self.stdout.write(f"Hit rate: {hit_rate:.2f}%")
        
        keys = con.keys("*")
        if keys:
            self.stdout.write(self.style.SUCCESS(f'\n=== Cache Keys ({len(keys)}) ==='))
            for key in keys[:20]:
                ttl = con.ttl(key)
                self.stdout.write(f"  {key.decode('utf-8')} (TTL: {ttl}s)")
            if len(keys) > 20:
                self.stdout.write(f"  ... and {len(keys) - 20} more keys")